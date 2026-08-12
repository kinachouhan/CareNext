import Address from "../models/address.js";

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const addAddress = async (req, res) => {
  try {
    const { fullName, phone, street, city, state, pincode, addressType, isDefault } = req.body;

    // If set as default, remove default flag from other addresses
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const newAddress = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      street,
      city,
      state,
      pincode,
      addressType,
      isDefault: isDefault || false,
    });

    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(201).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await Address.findOneAndDelete({ _id: id, user: req.user._id });

    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, street, city, state, pincode, addressType, isDefault } = req.body;

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const updated = await Address.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { fullName, phone, street, city, state, pincode, addressType, isDefault },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};