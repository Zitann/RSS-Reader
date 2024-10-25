export default class Result<T> {
  private data: T;
  private code: string;
  private message: string;

  constructor(data: T, code: string, message: string) {
    this.data = data;
    this.code = code;
    this.message = message;
  }

  public getData(): T {
    return this.data;
  }

  public getCode(): string {
    return this.code;
  }

  public getMessage(): string {
    return this.message;
  }

  public static success<T>(data: T, message = "响应成功"): Result<T> {
    return new Result(data, "success", message);
  }

  public static fail<T>(data: T): Result<T> {
    return new Result(data, "fail", "响应失败");
  }

  public static error<T>(data: T): Result<T> {
    return new Result(data, "error", "响应错误");
  }
}
