const Department = require("../models/Department");

const recalcDepartmentStats = async (departmentId) => {
  try {
    const department = await Department.findById(departmentId);
    if (department) {
      await department.recalculateStats();
    }
  } catch (error) {
    console.error("Error recalculating department stats:", error);
  }
};

module.exports = { recalcDepartmentStats };
