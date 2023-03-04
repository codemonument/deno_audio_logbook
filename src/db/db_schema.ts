export type AudioRecordingsTable = {
  // is number good? => forgeability
  audioId: number;

  // userId is string or number???
  userId: number;

  /**
   * The Path of the file on the storage
   */
  filePath: string;
};

export type UserTable = {
  // is number good? => forgeability
  userId: number;
};

export type DbSchema = {
  audiobook_recordings: AudioRecordingsTable;
  audiobook_users: UserTable;
};
