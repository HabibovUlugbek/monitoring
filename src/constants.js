const RoleEnum = {
  ADMIN: "Admin",
  REPUBLIC_EMPLOYEE: "Respublika xodimi",
  REGION_BOSS: "Viloyat boshqarma boshlig`i",
  REGION_EMPLOYEE: "Viloyat xodimi",
};

const StorageItemNameEnum = {
  ROLE_UPDATED: "roleUpdated",
  USER_INFO: "userInfo",
  USERS: "users",
  LOANS: "loans",
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

module.exports = { RoleEnum, StorageItemNameEnum, regions };
