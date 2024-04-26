import {
  AbstractPowerSyncDatabase,
  BaseObserver,
  CrudEntry,
  PowerSyncBackendConnector,
  UpdateType,
} from "@powersync/web";
import { Session, SupabaseClient, createClient } from "@supabase/supabase-js";

export type SupabaseConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  powersyncUrl: string;
};

export type SupabaseConnectorListener = {
  initialized: () => void;
  sessionStarted: (session: Session) => void;
};

/// Postgres Response codes that we cannot recover from by retrying.
const FATAL_RESPONSE_CODES = [
  // Class 22 — Data Exception
  // Examples include data type mismatch.
  new RegExp("^22...$"),
  // Class 23 — Integrity Constraint Violation.
  // Examples include NOT NULL, FOREIGN KEY and UNIQUE violations.
  new RegExp("^23...$"),
  // INSUFFICIENT PRIVILEGE - typically a row-level security violation
  new RegExp("^42501$"),
];

export class SupabaseConnector
  extends BaseObserver<SupabaseConnectorListener>
  implements PowerSyncBackendConnector
{
  readonly client: SupabaseClient;
  readonly config: SupabaseConfig;
  ready: boolean = false;
  currentSession: Session | null = null;

  constructor() {
    super();
    this.config = {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      powersyncUrl: import.meta.env.VITE_POWERSYNC_URL,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    };
    this.client = createClient(
      this.config.supabaseUrl,
      this.config.supabaseAnonKey,
      { auth: { persistSession: true } }
    );
  }

  async init() {
    console.log(
      "🚀🩷🥰​ ~ file: Connector.ts:35 ~ SupabaseConnector ~ init iniciando "
    );
    console.log(
      "🚀🩷🥰​ ~ file: Connector.ts:35 ~ SupabaseConnector ~ init ~ this.ready",
      this.ready
    );
    if (this.ready) {
      return;
    }

    const sessionResponse = await this.client.auth.getSession();
    console.log(
      "🚀🩷🥰​ ~ file: Connector.ts:39 ~ SupabaseConnector ~ init ~ sessionResponse:",
      sessionResponse
    );
    this.updateSession(sessionResponse.data.session);

    this.ready = true;
    //averiguar para que sirve esto?
    this.iterateListeners((cb) => cb.initialized?.());
  }

  async login(username: string, password: string) {
    const {
      data: { session },
      error,
    } = await this.client.auth.signInWithPassword({
      email: username,
      password,
    });
    console.log(
      "🚀🩷🥰​ ~ file: Connector.ts:49 ~ SupabaseConnector ~ login ~ session:",
      session
    );
    if (error) {
      console.log(
        "🚀🩷🥰​ ~ file: Connector.ts:47 ~ SupabaseConnector ~ login ~ error:",
        error
      );
      throw error;
    }
    this.updateSession(session);
  }

  async fetchCredentials() {
    const {
      data: { session },
      error,
    } = await this.client.auth.getSession();

    console.log(
      "🚀🩷🥰​ ~ file: Connector.ts:59 ~ SupabaseConnector ~ fetchCredentials ~ session:",
      session
    );
    if (!session || error) {
      console.log(
        "🚀🩷🥰​ ~ file: Connector.ts:64 ~ SupabaseConnector ~ fetchCredentials ~ error:",
        error
      );
      throw new Error(`Could not fetch Supabase credentials: ${error}`);
    }

    console.debug("session expires at", session.expires_at);

    return {
      client: this.client,
      endpoint: this.config.powersyncUrl,
      token: session.access_token ?? "",
      expiresAt: session.expires_at
        ? new Date(session.expires_at * 1000)
        : undefined,
    };
  }

  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    const transaction = await database.getNextCrudTransaction();
    console.log(
      "🚀🩷🥰​ ~ file: Connector.ts:80 ~ SupabaseConnector ~ uploadData ~ transaction:",
      transaction
    );

    if (!transaction) {
      return;
    }

    let lastOp: CrudEntry | null = null;
    try {
      // Note: If transactional consistency is important, use database functions
      // or edge functions to process the entire transaction in a single call.
      for (const op of transaction.crud) {
        lastOp = op;
        const table = this.client.from(op.table);
        console.log("🚀🩷🥰​ ~ file: Connector.ts:150 ~ uploadData ~ table:", table);
        let result: unknown;
        switch (op.op) {
          case UpdateType.PUT:
            // eslint-disable-next-line no-case-declarations
            const record = { ...op.opData, id: op.id };
            result = await table.upsert(record);
            break;
          case UpdateType.PATCH:
            result = await table.update(op.opData).eq("id", op.id);
            break;
          case UpdateType.DELETE:
            result = await table.delete().eq("id", op.id);
            break;
        }

        if (
          result &&
          typeof result === "object" &&
          "error" in result &&
          result.error
        ) {
          console.error(result.error);
          throw new Error(
            `Could not update Supabase. Received error: ${result.error}`
          );
        }
        console.log("🚀🩷🥰​ ~ file: Connector.ts:178 ~ uploadData ~ result:", result);
      }
      console.log(
        "🚀🩷🥰​ ~ file: Connector.ts:108 ~ SupabaseConnector ~ uploadData ~ transaction ABOUT TO COMPLETE;"
      );
      await transaction.complete();
      console.log(
        "🚀🩷🥰​ ~ file: Connector.ts:108 ~ SupabaseConnector ~ uploadData ~ transaction COMPLETED;"
      );
    } catch (ex: unknown) {
      console.debug(ex);
      if (
        ex &&
        typeof ex === "object" &&
        "code" in ex &&
        typeof ex.code === "string" &&
        FATAL_RESPONSE_CODES.some((regex) => regex.test(ex.code as string))
      ) {
        /**
         * Instead of blocking the queue with these errors,
         * discard the (rest of the) transaction.
         *
         * Note that these errors typically indicate a bug in the application.
         * If protecting against data loss is important, save the failing records
         * elsewhere instead of discarding, and/or notify the user.
         */
        console.error(`Data upload error - discarding ${lastOp}`, ex);
        await transaction.complete();
      } else {
        // Error may be retryable - e.g. network error or temporary server error.
        // Throwing an error here causes this call to be retried after a delay.
        throw ex;
      }
    }
  }

  private updateSession(session: Session | null) {
    this.currentSession = session;
    if (!session) {
      return;
    }
    this.iterateListeners((cb) => cb.sessionStarted?.(session));
  }
}
