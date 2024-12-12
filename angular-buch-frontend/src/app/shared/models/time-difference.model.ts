const millisPerSeconds = 1000;

export class TimeDifference {
  private readonly _milliseconds: number;

  constructor(milliseconds: number) {
    this._milliseconds = milliseconds;
  }

  get milliseconds(): number {
    return this._milliseconds;
  }

  get seconds(): number {
    return this._milliseconds / millisPerSeconds;
  }

  public static inMilliseconds(value: number): TimeDifference {
    return new TimeDifference(value);
  }

  public static inSeconds(value: number): TimeDifference {
    return new TimeDifference(value * millisPerSeconds);
  }

  public add(other: TimeDifference): TimeDifference {
    const resultInMilliseconds = this._milliseconds + other._milliseconds;
    return new TimeDifference(resultInMilliseconds);
  }

  public subtract(other: TimeDifference): TimeDifference {
    const resultInMilliseconds = this._milliseconds - other._milliseconds;
    return new TimeDifference(resultInMilliseconds);
  }
}
