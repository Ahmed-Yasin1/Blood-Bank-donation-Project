import express from "express";
import {
addBlood,
getInventory,
updateInventory,
deleteInventory
} from "../controllers/InventoryController.js";


const router = express.Router();
router.post("/",addBlood);
router.get("/",getInventory);
router.put("/:id",updateInventory);
router.delete("/:id",deleteInventory);


export default router;