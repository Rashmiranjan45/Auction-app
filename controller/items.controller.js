import Item from "../models/items.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const createItem = async(req,res) => {
    try {
        const {name, description , startingPrice, endTime} = req.body
        if ([name,description,startingPrice,endTime].some((field) => field?.trim() === "")) {
            throw new ApiError(404,"All fields are required")
        }
        const items = await Item.create({
          name,
          description,
          startingPrice,
          endTime,
          imageUrl: `/uploads/${req.file.filename}`,
          owner:req.user._id
        });
        if (!items) {
            throw new ApiError(500,"Items not created.")
        }
        return res
        .status(201)
        .json(new ApiResponse(200,items,"items created successfully"))
    } catch (error) {
        console.log("ERROR :: WHILE CREATING AN ITEM :: ",error)
    }
}

const getAllItems = async(req,res) => {
    try {
        const pageSize = 10; // Adjust as needed
        const page = parseInt(req.query.page) || 1;
        const items = await Item.find({}).skip(pageSize * (page-1)).limit(pageSize)
        return res
        .status(200)
        .json(new ApiResponse(200,items,"All items fetched successfully"))
    } catch (error) {
        console.log("ERROR :: WHILE FETCHING ALL ITEMS :: ",error)
    }
}

const getSingleItem = async(req,res) => {
    try {
        const _id = req.params.id;
        const item = await Item.findById(_id)
        if (!item) {
            throw new ApiError(404,"Item does not exist")
        }
        return res
        .status(200)
        .json(new ApiResponse(200,item,"item fetched..."))
    } catch (error) {
        console.log("ERROR :: WHILE FETCHING SINGLE ITEM :: ",error)
    }
}

const deleteItem = async(req,res) => {
    try {
        const _id = req.params.id;
        
        const deletedItem = await Item.findByIdAndDelete(_id)
        if (!deleteItem) {
            throw new ApiError(501, "Item not deleted please try again later");
        }
        return res
        .status(200)
        .json(new ApiResponse(200,{},"Item deleted."))

    } catch (error) {
        console.log("ERROR :: WHILE DELETING AN ITEM ::",error)
    }
}

const updateItem = async(req,res) => {
    try {
        const _id = req.params.id;
        const { name, description, startingPrice, endTime } = req.body;
        if ([name, description, startingPrice, endTime].some(
            (field) => field?.trim() === "")) {
          throw new ApiError(404, "All fields are required");
        }
        const item = await Item.findByIdAndUpdate(_id,{
            $set:{
                name:name,
                description:description,
                startingPrice:startingPrice,
                imageUrl:req.file?.filename,
                endTime:endTime
            }
        }) 
        if (!item) {
            throw new ApiError(501, "Item not found and update as well");
        }
        return res
        .status(200)
        .json(new ApiResponse(200,item,"Item details updated successfully."))

    } catch (error) {
        console.log("ERROR :: WHILE UPDATING AN ITEM ::", error);
        
    }
}


export {
    createItem,
    getAllItems,
    getSingleItem,
    deleteItem,
    updateItem
}