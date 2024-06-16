type TimeUnit = 'day' | 'hour' | 'minute' | 'second' | 'ms';

const conversionFactors: Record<TimeUnit, number> = {
  day: 86400000, // 24 * 60 * 60 * 1000
  hour: 3600000, // 60 * 60 * 1000
  minute: 60000, // 60 * 1000
  second: 1000, // 1000
  ms: 1,
};

function convert(value: number, from: TimeUnit, to: TimeUnit) {
  const fromFactor = conversionFactors[from];
  const toFactor = conversionFactors[to];

  return (value * fromFactor) / toFactor;
}

export default convert;
