import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class AuthServiceProvider {
  private static serviceProvider: SupabaseClient;

  constructor() {}

  static async getAuthServiceProvider(SUPABASE_URL: string, SUPABASE_ANON_KEY: string) {
    try {
      if (!AuthServiceProvider.serviceProvider) {
        AuthServiceProvider.serviceProvider = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      }
      return AuthServiceProvider.serviceProvider;
    } catch (error) {
      return Promise.reject(false);
    }
  }

  public static getClient() {
    return AuthServiceProvider.serviceProvider;
  }

  public get serviceProvider() {
    return AuthServiceProvider.serviceProvider;
  }
}
