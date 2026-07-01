export const success = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    ...(data !== null && { data }),
  }
  return res.status(statusCode).json(response)
}

export const created = (res, data = null, message = 'Created successfully') => {
  return success(res, data, message, 201)
}

export const noContent = (res) => {
  return res.status(204).end()
}

export const paginated = (res, { data, total, page, limit, totalPages }) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  })
}

export const error = (res, message = 'Error', statusCode = 500, code = 'ERROR') => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    code,
  })
}
