import mongoose from 'mongoose';

const BusinessDomainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String
  }
});


const BusinessDomain = mongoose.model('BusinessDomain', BusinessDomainSchema);
export default BusinessDomain;