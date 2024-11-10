const millisInSeconds = 1000;

export class TimeDifference {
  private readonly _milliseconds: number;

  constructor(milliseconds: number) {
    this._milliseconds = milliseconds;
  }

  get milliseconds(): number {
    return this._milliseconds;
  }

  get seconds(): number {
    return this._milliseconds / millisInSeconds;
  }

  public static fromMilliseconds(value: number): TimeDifference {
    return new TimeDifference(value);
  }

  public static fromSeconds(value: number): TimeDifference {
    return new TimeDifference(value * millisInSeconds);
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
