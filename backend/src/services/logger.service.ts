class Logger {
  private readonly error: unknown;
  public statusCode: number;
  public message: string;
  constructor(error: unknown) {
    this.error = error;
    this.statusCode = 500;
    this.message = 'Internal Server Error';
    this.generateMessage();
  }

  private generateMessage(): void {
    if (this.error instanceof Error) {
      this.message = this.error.message;
    } else if (typeof this.error === 'string') {
      this.message = this.error;
    }
  }
}

export const getLoggerInstance = (error: unknown): Logger => {
  return new Logger(error);
};
