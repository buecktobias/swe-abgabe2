import { TimeDifference } from './time-difference.model';

describe('TimeDifference', () => {
  it('should create an instance from milliseconds', () => {
    const time = TimeDifference.inMilliseconds(2000);
    expect(time.milliseconds).toBe(2000);
    expect(time.seconds).toBe(2);
  });

  it('should create an instance from seconds', () => {
    const time = TimeDifference.inSeconds(2);
    expect(time.milliseconds).toBe(2000);
    expect(time.seconds).toBe(2);
  });

  it('should return the correct milliseconds value', () => {
    const time = new TimeDifference(5000);
    expect(time.milliseconds).toBe(5000);
  });

  it('should return the correct seconds value', () => {
    const time = new TimeDifference(3000);
    expect(time.seconds).toBe(3);
  });

  it('should add two TimeDifference instances correctly', () => {
    const time1 = TimeDifference.inMilliseconds(2000);
    const time2 = TimeDifference.inMilliseconds(3000);
    const result = time1.add(time2);
    expect(result.milliseconds).toBe(5000);
    expect(result.seconds).toBe(5);
  });

  it('should subtract two TimeDifference instances correctly', () => {
    const time1 = TimeDifference.inMilliseconds(5000);
    const time2 = TimeDifference.inMilliseconds(2000);
    const result = time1.subtract(time2);
    expect(result.milliseconds).toBe(3000);
    expect(result.seconds).toBe(3);
  });

  it('should handle subtracting resulting in zero correctly', () => {
    const time1 = TimeDifference.inMilliseconds(2000);
    const time2 = TimeDifference.inMilliseconds(2000);
    const result = time1.subtract(time2);
    expect(result.milliseconds).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it('should handle negative results in subtraction', () => {
    const time1 = TimeDifference.inMilliseconds(2000);
    const time2 = TimeDifference.inSeconds(3);
    const result = time1.subtract(time2);
    expect(result.milliseconds).toBe(-1000);
    expect(result.seconds).toBe(-1);
  });
});
