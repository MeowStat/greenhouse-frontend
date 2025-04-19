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
    SUN: 'chủ nhật',
    MON: 'thứ hai',
    TUE: 'thứ ba',
    WED: 'thứ tư',
    THU: 'thứ năm',
    FRI: 'thứ sáu',
    SAT: 'thứ bảy',
  };

export const DEVICE_ON_OFF = [
   { status: true, power: 100},
   { status: false, power: 0}
]

export const COMPARISION_OPERATORS = [
  { label: "Bằng", value: "=="},
  { label: "Khác", value: "!="},
  { label: "Lớn hơn", value: ">"},
  { label: "Nhỏ hơn", value: "<"},
  { label: "Lớn hơn hoặc bằng", value: ">="},
  { label: "Nhỏ hơn hoặc bằng", value: "<="},
]