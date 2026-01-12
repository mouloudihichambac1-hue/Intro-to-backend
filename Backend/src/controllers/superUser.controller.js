import {Admin} from '../models/admin.model.js';
export const deleteAdmin = async (req, res) => {
    try {
        const AdminId = req.params.id;
        const deletedAdmin = await Admin.findByIdAndDelete(AdminId );

        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json({ message: "Administration deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}; 