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
    id: "03",
    name: "Andijon",
  },
  {
    id: "26",
    name: "Tashkent",
  },
  {
    id: "18",
    name: "Samarkand",
  },
  {
    id: "14",
    name: "Namangan",
  },
  {
    id: "06",
    name: "Buxoro",
  },
  {
    id: "35",
    name: "Qoraqalpog`iston Respublikasi",
  },
  {
    id: "30",
    name: "Fergana",
  },
  {
    id: "24",
    name: "Sirdaryo",
  },
  {
    id: "08",
    name: "Jizzax",
  },
  {
    id: "22",
    name: "Surxondaryo",
  },
  {
    id: "12",
    name: "Navoiy",
  },
  {
    id: "33",
    name: "Xorazm",
  },
  {
    id: "10",
    name: "Qashqadaryo",
  },
  {
    id: "27",
    name: "Toshkent viloyati",
  },
];

module.exports = { RoleEnum, StorageItemNameEnum, regions, LoanStatusEnum };
