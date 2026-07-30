export type FreightType = "road" | "rail" | "ocean" | "air";

export interface CountryCode {
  iso: string;
  dial: string;
  flag: string;
}

export interface ContactInfo {
  company: string;
  email: string;
  countryCode: string; // iso code, references CountryCode
  phone: string;
  address: string;
}

export interface PackageDetails {
  itemDescription: string;
  quantity: number;
  value: string;
  weight: string;
  weightUnit: "Kg" | "Lb";
  length: string;
  width: string;
  height: string;
}

export interface ShippingDetails {
  freightType: FreightType;
  carrier: string;
  shippingMethod: string;
  shipmentId: string;
  shipmentDate: string;
  notes: string;
  insuranceCoverage: boolean;
  temperatureControl: boolean;
  signatureOnDelivery: boolean;
  fragileItemHandling: boolean;
  notifyRecipient: boolean;
}

export interface ShipmentFormData {
  sender: ContactInfo;
  recipient: ContactInfo;
  package: PackageDetails;
  shipping: ShippingDetails;
}
