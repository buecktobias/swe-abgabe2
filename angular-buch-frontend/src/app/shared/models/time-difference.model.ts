const millisInSeconds = 1000;

export class TimeDifference {
  private readonly _ms: number;

  constructor(milliseconds: number) {
    this._ms = milliseconds;
  }

  get ms(): number {
    return this._ms;
  }

  get seconds(): number {
    return this._ms / millisInSeconds;
  }

  public static fromMilliseconds(value: number): TimeDifference {
    return new TimeDifference(value);
  }

  public static fromSeconds(value: number): TimeDifference {
    return new TimeDifference(value * millisInSeconds);
  }

  public add(other: TimeDifference): TimeDifference {
    const resultInMilliseconds = this._ms + other._ms;
    return new TimeDifference(resultInMilliseconds);
  }

  public subtract(other: TimeDifference): TimeDifference {
    const resultInMilliseconds = this._ms - other._ms;
    return new TimeDifference(resultInMilliseconds);
  }
}
