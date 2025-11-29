const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true
  },
  email: { 
    type: String, 
    unique: true, 
    required: true 
  },
  password: { 
    type: String, 
    required: true,
    default:"NA"
  },
  address: { 
    type: String, 
    required: true,
    default:"NA"
  },
  vehicleNumber: { 
    type: String, 
    required: true,
    default:"NA"
  },
  vehicleType: { 
    type: String, 
    enum: ['NA','Car', 'Bike', 'Truck'], 
    required: true,
    default:"NA"
  },
  vehicleModel: { 
    type: String, 
    required: true,
    default:"NA"
  },
  phone: { 
    type: String, 
    required: true,
    default:"NA"
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  }
});

module.exports = mongoose.model('User', UserSchema);
