const RoleEnum = {
  REPUBLIC_BOSS: "Respublika Rahbari",
  REPUBLIC_EMPLOYEE: "Respublika Xodimi",
  REGION_BOSS: "Hudud Rahbari",
  REGION_EMPLOYEE: "Hudud Xodimi",
  REGION_CHECKER_BOSS: "Hudud Nazoratchisi Rahbari",
  REGION_CHECKER_EMPLOYEE: "Hudud Nazoratchisi Xodimi",
};

const LoanStatusEnum = {
  PENDING: "Pending",
  MAQSADLI: "Maqsadli",
  MAQSADSIZ: "Maqsadsiz",
  QISMAN_MAQSADLI: "Qisman Maqsadli",
  QISMAN_MAQSADSIZ: "Qisman Maqsadsiz",
  CANCELLED: "Cancelled",
  SUCCESS: "Success",
  OUTDATED: "Outdated",
};

const StorageItemNameEnum = {
  ROLE_UPDATED: "roleUpdated",
  USER_INFO: "userInfo",
  USERS: "users",
  LOANS: "loans",
  LOAN_FILES: "loanFiles",
};
const regions = [
  {
    id: "02",
    name: "Andijon",
  },
  {
    id: "03",
    name: "Buxoro",
  },
  {
    id: "04",
    name: "Jizzax",
  },
  {
    id: "06",
    name: "Qashqadaryo",
  },
  {
    id: "05",
    name: "Navoiy",
  },
  {
    id: "14",
    name: "Namangan",
  },
  {
    id: "18",
    name: "Samarqand",
  },
  {
    id: "22",
    name: "Surxondaryo",
  },
  {
    id: "24",
    name: "Sirdaryo",
  },
  {
    id: "10",
    name: "MBRC",
  },
  {
    id: "26",
    name: "Toshkent shahar",
  },
  {
    id: "77",
    name: "Toshkent shahar",
  },
  {
    id: "27",
    name: "Toshkent viloyati",
  },
  {
    id: "30",
    name: "Farg‘ona",
  },
  {
    id: "33",
    name: "Xorazm",
  },
  {
    id: "35",
    name: "Qoraqalpog‘iston Respublikasi",
  },
];

module.exports = { RoleEnum, StorageItemNameEnum, regions, LoanStatusEnum };
