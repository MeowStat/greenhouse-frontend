export const EMPTY_STRING = '--';

export const DAY_OF_WEEK = [
    { label: 'S', code: 'SUN' },
    { label: 'M', code: 'MON' },
    { label: 'T', code: 'TUE' },
    { label: 'W', code: 'WED' },
    { label: 'T', code: 'THU' },
    { label: 'F', code: 'FRI' },
    { label: 'S', code: 'SAT' },
  ];

export const FULL_DAY_VI = {
    SUN: 'Chủ nhật',
    MON: 'Thứ hai',
    TUE: 'Thứ ba',
    WED: 'Thứ tư',
    THU: 'Thứ năm',
    FRI: 'Thứ sáu',
    SAT: 'Thứ bảy',
  };

export const DEVICE_ON_OFF = [
   { status: true, power: 100},
   { status: false, power: 0}
]

export const POWER_LEVELS = [0, 20, 40, 60, 80, 100]

export const COMPARISION_OPERATORS = [
  { label: "Bằng", value: "=="},
  { label: "Khác", value: "!="},
  { label: "Lớn hơn", value: ">"},
  { label: "Nhỏ hơn", value: "<"},
  { label: "Lớn hơn hoặc bằng", value: ">="},
  { label: "Nhỏ hơn hoặc bằng", value: "<="},
]

export const UNITS = ["°C", "%", "Lux"]