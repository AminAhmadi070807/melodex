"use strict"

module.exports = (page, limit, counts) => {
    const pageCount = Math.ceil(+counts || 1 / +limit)

    return { page, limit, totalPage: pageCount, counts}
}