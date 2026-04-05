module.exports = {
  success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  },

  created(res, data, message = 'Created successfully') {
    return res.status(201).json({
      success: true,
      message,
      data
    });
  },

  paginated(res, data, pagination, message = 'Fetched successfully') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination
    });
  }
};
