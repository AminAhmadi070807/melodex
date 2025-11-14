"use strict"

const planModel = require('./plan.model')
const response = require('../../../helpers/response.helper')
const {isValidObjectId} = require("mongoose");

module.exports.create = async (req, res, next) => {
    try {
        const { durationMonths, members, price, plan, discount } = req.body

        const newPlan = await planModel.create({
            durationMonths,
            members,
            price,
            discount,
            plan
        })

        return response(res, 201, "Created new plan successfully", newPlan)
    }
    catch (error) {
        next(error)
    }
}

module.exports.get = async (req, res, next) => {
    try {
        const plans = await planModel.find({}).lean()

        const plansArray = []

        for (const plan of plans) {
            plansArray.push({
                ...plan,
                price: plan.price.toLocaleString(),
                newPrice: (plan.price * (1 - plan.discount / 100)).toLocaleString()
            })
        }

        return response(res, 200, null, { plans: plansArray })
    }
    catch (error) {
        next(error)
    }
}

module.exports.getOne = async (req, res, next) => {
    try {
        const { id } = req.params

        const plan = await planModel.findById(id).lean()

        const planObject = {
            ...plan,
            price: plan.price.toLocaleString(),
            newPrice: (plan.price * (1 - plan.discount / 100)).toLocaleString()
        }

        return response(res, 200, null, {plan: planObject})
    }
    catch (error) {
        next(error)
    }
}

module.exports.update = async (req, res, next) => {
    try {
        const { id } = req.params

        const plan = await planModel.findByIdAndUpdate(id, {
            ...req.body
        }, { new: true })

        return response(res, 200, "Updated new plan successfully", plan)
    }
    catch (error) {
        next(error)
    }
}

module.exports.remove = async (req, res, next) => {
    try {
        const { id, planId } = req.body

        if (!isValidObjectId(planId) || !isValidObjectId(id)) return response(res, 422, "id is not correct")

        const plan = await planModel.findByIdAndDelete(id).lean()

        return response(res, 200, "deleted plan and update user plan successfully", plan)
    }
    catch (error) {
        next(error)
    }
}

