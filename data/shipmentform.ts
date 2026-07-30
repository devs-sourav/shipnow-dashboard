import { CountryCode, ShipmentFormData } from "@/types/shipmentform";

export const countryCodes: CountryCode[] = [
  { iso: "US", dial: "+1", flag: "🇺🇸" },
  { iso: "BD", dial: "+880", flag: "🇧🇩" },
  { iso: "GB", dial: "+44", flag: "🇬🇧" },
  { iso: "CA", dial: "+1", flag: "🇨🇦" },
  { iso: "AU", dial: "+61", flag: "🇦🇺" },
  { iso: "IN", dial: "+91", flag: "🇮🇳" },
];

export const carriers = ["FedEx", "UPS", "DHL", "USPS", "Maersk"];

export const shippingMethodsByFreight: Record<string, string[]> = {
  road: ["Standard Ground", "Expedited Ground", "LTL Freight"],
  rail: ["Intermodal Rail", "Bulk Rail"],
  ocean: ["FCL (Full Container)", "LCL (Less than Container)"],
  air: ["Standard Air", "Express Air", "Air Charter"],
};

export const weightUnits = ["Kg", "Lb"] as const;

// Pre-filled mock data matching a typical B2B shipment scenario
export const mockShipmentData: ShipmentFormData = {
  sender: {
    company: "",
    email: "",
    countryCode: "",
    phone: "",
    address: "",
  },
  recipient: {
    company: "",
    email: "",
    countryCode: "",
    phone: "",
    address: "",
  },
  package: {
    itemDescription: "",
    quantity: 0,
    value: "",
    weight: "",
    weightUnit: "Kg",
    length: "",
    width: "",
    height: "",
  },
  shipping: {
    freightType: "road",
    carrier: "",
    shippingMethod: "",
    shipmentId: "",
    shipmentDate: "",
    notes: "",
    insuranceCoverage: true,
    temperatureControl: true,
    signatureOnDelivery: true,
    fragileItemHandling: false,
    notifyRecipient: true,
  },
};
