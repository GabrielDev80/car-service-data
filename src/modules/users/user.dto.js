export const userDTO = (data) => {
  return {
    user_id: data._id,
    first_name: data.first_name,
    last_name: data.last_name,
    username: data.nickname,
    phone: data.phone || null,
    email: data.email,
    role: data.role,
    thumbnail: data.thumbnail || null,
    vehicles: data.vehicles || null,
    license: {
      licenseClass: data.license?.licenseClass || null,
      expireDate: data.license?.expireDate || null,
    },
    linti: {
      psichoPhysicalTest: data.linti?.psichoPhysicalTest || null,
      expPsichoPhysicalTest: data.linti?.expPsichoPhysicalTest || null,
      course: data.linti?.course || null,
      expCourse: data.linti?.expCourse || null,
    },
    created_at: data.createdAt,
    updated_at: data.updatedAt,
  };
};
