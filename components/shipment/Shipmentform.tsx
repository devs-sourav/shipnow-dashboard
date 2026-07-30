"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Calendar,
  Plus,
  Minus,
  Trash2,
  Check,
  Truck,
  TrainFront,
  Ship,
  Plane,
} from "lucide-react";
import { countryCodes, carriers, shippingMethodsByFreight } from "@/data/shipmentform";
import { ContactInfo, FreightType, ShipmentFormData } from "@/types/shipmentform";

const freightOptions: { id: FreightType; label: string; icon: typeof Truck }[] = [
  { id: "road", label: "Road Freight", icon: Truck },
  { id: "rail", label: "Rail Freight", icon: TrainFront },
  { id: "ocean", label: "Ocean Freight", icon: Ship },
  { id: "air", label: "Air Freight", icon: Plane },
];

// ---- Empty initial data + Shipment ID auto-generator ----
function generateShipmentId() {
  const rand = Math.floor(1000000 + Math.random() * 9000000); // 7-digit random number
  return `#SH${rand}`;
}

const emptyContact: ContactInfo = {
  company: "",
  email: "",
  countryCode: countryCodes[0]?.iso ?? "",
  phone: "",
  address: "",
};

function getEmptyShipmentData(): ShipmentFormData {
  return {
    sender: { ...emptyContact },
    recipient: { ...emptyContact },
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
      shipmentId: generateShipmentId(),
      shipmentDate: "",
      notes: "",
      insuranceCoverage: false,
      temperatureControl: false,
      signatureOnDelivery: false,
      fragileItemHandling: false,
      notifyRecipient: false,
    },
  };
}

function Field({
  label,
  children,
  hint,
  hintTone = "info",
  required,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  hintTone?: "info" | "error";
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs lg:text-sm font-medium text-gray-500">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && (
        <span
          className={`text-[11px]  ${hintTone === "error" ? "text-red-500" : "text-indigo-500"
            }`}
        >
          {hint}
        </span>
      )}
    </div>
  );
}

const inputBase =
  "w-full rounded-lg bg-white border border-transparent px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
const inputBase1 =
  "w-full rounded-lg bg-[#F5F5F5] border border-transparent px-3.5 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const errorRing = "border-indigo-400 ring-2 ring-indigo-100";

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-xs lg:text-sm text-gray-700"
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded transition ${checked ? "bg-indigo-600" : "bg-gray-200"
          }`}
      >
        {checked && <Check size={12} strokeWidth={3} className="text-white" />}
      </span>
      {label}
    </button>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full transition ${checked ? "bg-indigo-600" : "bg-gray-300"
        }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "-translate-x-4" : "translate-x-0.5"
          }`}
      />
    </button>
  );
}

// All contact fields (company, email, phone, address) are mandatory.
function ContactFields({
  value,
  onChange,
  addressPlaceholder,
  showErrors,
}: {
  value: ContactInfo;
  onChange: (v: ContactInfo) => void;
  addressPlaceholder: string;
  showErrors?: boolean;
}) {
  const companyMissing = showErrors && value.company.trim().length === 0;
  const emailMissing = showErrors && value.email.trim().length === 0;
  const phoneMissing = showErrors && value.phone.trim().length === 0;
  const addressMissing = showErrors && value.address.trim().length === 0;

  return (
    <div className="flex flex-col gap-4">
      <Field
        label="Company"
        required
        hint={companyMissing ? "Company is required." : undefined}
        hintTone="error"
      >
        <input
          className={`${inputBase} ${companyMissing ? errorRing : ""}`}
          placeholder="e.g. Acme Logistics Ltd."
          value={value.company}
          onChange={(e) => onChange({ ...value, company: e.target.value })}
        />
      </Field>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field
          label="Email"
          required
          hint={emailMissing ? "Email is required." : undefined}
          hintTone="error"
        >
          <input
            className={`${inputBase} ${emailMissing ? errorRing : ""}`}
            placeholder="name@company.com"
            value={value.email}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
          />
        </Field>

        <Field
          label="Phone Number"
          required
          hint={phoneMissing ? "Phone number is required." : undefined}
          hintTone="error"
        >
          <div
            className={`flex overflow-hidden rounded-lg bg-white  focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 border border-transparent focus-within:border-indigo-400 ${phoneMissing ? errorRing : ""
              }`}
          >
            <div className="relative flex items-center gap-1 border-r border-gray-200 px-2.5 text-sm">
              <select
                value={value.countryCode}
                onChange={(e) => onChange({ ...value, countryCode: e.target.value })}
                className="appearance-none bg-transparent pr-4 text-sm outline-none cursor-pointer"
              >
                {countryCodes.map((c) => (
                  <option key={c.iso} className="cursor-pointer" value={c.iso}>
                    {c.flag} {c.dial}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-2 text-gray-400" />
            </div>
            <input
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-gray-400"
              placeholder="1XXX-XXXXXX"
              value={value.phone}
              onChange={(e) => onChange({ ...value, phone: e.target.value })}
            />
          </div>
        </Field>
      </div>

      <Field
        label={addressPlaceholder === "Pickup Address" ? "Pickup Address" : "Delivery Address"}
        required
        hint={addressMissing ? "Address is required." : undefined}
        hintTone="error"
      >
        <input
          className={`${inputBase} ${addressMissing ? errorRing : ""}`}
          placeholder="Street address, city, state/province, ZIP code"
          value={value.address}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
        />
      </Field>
    </div>
  );
}

export default function ShipmentForm() {
  const [data, setData] = useState<ShipmentFormData>(() => getEmptyShipmentData());
  const [submitted, setSubmitted] = useState(false);
  const methodOptions = useMemo(
    () => shippingMethodsByFreight[data.shipping.freightType] ?? [],
    [data.shipping.freightType]
  );

  // ---- Mandatory-field checks ----
  const senderMissing =
    data.sender.company.trim().length === 0 ||
    data.sender.email.trim().length === 0 ||
    data.sender.phone.trim().length === 0 ||
    data.sender.address.trim().length === 0;

  const recipientMissing =
    data.recipient.company.trim().length === 0 ||
    data.recipient.email.trim().length === 0 ||
    data.recipient.phone.trim().length === 0 ||
    data.recipient.address.trim().length === 0;

  const itemDescriptionMissing = data.package.itemDescription.trim().length === 0;
  const quantityMissing = data.package.quantity <= 0;
  const weightMissing = data.package.weight.trim().length === 0;

  const carrierRequired = data.shipping.carrier.trim().length === 0;
  const methodRequired = data.shipping.shippingMethod.trim().length === 0;
  const shipmentDateMissing = data.shipping.shipmentDate.trim().length === 0;

  const hasErrors =
    senderMissing ||
    recipientMissing ||
    itemDescriptionMissing ||
    quantityMissing ||
    weightMissing ||
    carrierRequired ||
    methodRequired ||
    shipmentDateMissing;

  const handleSubmit = () => {
    setSubmitted(true);

    if (hasErrors) {
      // Validation failed — required-field hints are now visible.
      return;
    }

    // TODO: put actual submit logic here (API call, etc.)
  };

  const handleDelete = () => {
    setData(getEmptyShipmentData());
    setSubmitted(false);
  };

  return (
    <div className=" bg-white p-4 rounded-xl sm:p-5">
      <div className="mx-auto ">
        <h1 className="mb-4 sm:mb-6 text-lg font-semibold text-gray-900">Shipment Form</h1>

        {/* Sender / Recipient */}
        <div className="grid grid-cols-1  rounded-2xl bg-[#F5F5F5] p-4 lg:p-6  md:grid-cols-2 ">
          <div className="pb-4 sm:pb-0 sm:pr-4 lg:pr-5 border-b sm:border-b-0 border-b-[#e0e0e0] md:border-r border-r-[#E0E0E0]">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Sender Info</h2>
            <ContactFields
              value={data.sender}
              onChange={(sender) => setData({ ...data, sender })}
              addressPlaceholder="Pickup Address"
              showErrors={submitted}
            />
          </div>
          <div className="pt-4 sm:pt-0 sm:pl-4 lg:pl-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Recipient Info</h2>
            <ContactFields
              value={data.recipient}
              onChange={(recipient) => setData({ ...data, recipient })}
              addressPlaceholder="Delivery Address"
              showErrors={submitted}
            />
          </div>
        </div>

        {/* Package / Shipping */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12">
          {/* Package Details */}
          <div className="md:col-span-4 border-b lg:border-b-0 border-b-[#e0e0e0] lg:border-r border-r-[#E0E0E0] pb-5 lg:pb-0 lg:pr-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Package Details</h2>
            <div className="flex flex-col gap-4">
              <Field
                label="Item Description"
                required
                hint={
                  submitted && itemDescriptionMissing
                    ? "Item description is required."
                    : undefined
                }
                hintTone="error"
              >
                <input
                  className={`${inputBase1} ${submitted && itemDescriptionMissing ? errorRing : ""}`}
                  placeholder="e.g. Electronics, machinery parts"
                  value={data.package.itemDescription}
                  onChange={(e) =>
                    setData({
                      ...data,
                      package: { ...data.package, itemDescription: e.target.value },
                    })
                  }
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Quantity"
                  required
                  hint={submitted && quantityMissing ? "Quantity is required." : undefined}
                  hintTone="error"
                >
                  <div
                    className={`flex items-center bg-[#f5f5f5] overflow-hidden rounded-lg  pr-1 ${submitted && quantityMissing ? errorRing : ""
                      }`}
                  >
                    <input
                      className="w-full bg-transparent  px-3.5 py-2.5 text-sm outline-none"
                      placeholder="0"
                      value={data.package.quantity === 0 ? "" : data.package.quantity}
                      onChange={(e) =>
                        setData({
                          ...data,
                          package: { ...data.package, quantity: Number(e.target.value) || 0 },
                        })
                      }
                    />
                    <div className="flex flex-col">
                      <button
                        type="button"
                        onClick={() =>
                          setData({
                            ...data,
                            package: { ...data.package, quantity: data.package.quantity + 1 },
                          })
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setData({
                            ...data,
                            package: {
                              ...data.package,
                              quantity: Math.max(0, data.package.quantity - 1),
                            },
                          })
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Minus size={12} />
                      </button>
                    </div>
                  </div>
                </Field>

                <Field label="Value">
                  <input
                    className={inputBase1}
                    placeholder="e.g. 1500 USD"
                    value={data.package.value}
                    onChange={(e) =>
                      setData({ ...data, package: { ...data.package, value: e.target.value } })
                    }
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Weight"
                  required
                  hint={submitted && weightMissing ? "Weight is required." : undefined}
                  hintTone="error"
                >
                  <input
                    className={`${inputBase1} ${submitted && weightMissing ? errorRing : ""}`}
                    placeholder="e.g. 25"
                    value={data.package.weight}
                    onChange={(e) =>
                      setData({ ...data, package: { ...data.package, weight: e.target.value } })
                    }
                  />
                </Field>
                <Field label="Units">
                  <div className="relative">
                    <select
                      className={`${inputBase1} appearance-none pr-8`}
                      value={data.package.weightUnit}
                      onChange={(e) =>
                        setData({
                          ...data,
                          package: {
                            ...data.package,
                            weightUnit: e.target.value as "Kg" | "Lb",
                          },
                        })
                      }
                    >
                      <option value="Kg">Kg</option>
                      <option value="Lb">Lb</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </Field>
              </div>

              <div>
                <label className="mb-1.5 block text-xs lg:text-sm font-medium text-gray-500">Dimensions</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <input
                        className={inputBase1}
                        placeholder="ex. 20"
                        value={data.package.length}
                        onChange={(e) =>
                          setData({
                            ...data,
                            package: { ...data.package, length: e.target.value },
                          })
                        }
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        cm
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">Length</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <input
                        className={inputBase1}
                        placeholder="ex. 20"
                        value={data.package.width}
                        onChange={(e) =>
                          setData({ ...data, package: { ...data.package, width: e.target.value } })
                        }
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        cm
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">Width</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="relative">
                      <input
                        className={inputBase1}
                        placeholder="ex. 20"
                        value={data.package.height}
                        onChange={(e) =>
                          setData({
                            ...data,
                            package: { ...data.package, height: e.target.value },
                          })
                        }
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                        cm
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">Height</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="md:col-span-8 pt-5 lg:pt-0 lg:pl-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">Shipping Details</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-3 sm:mb-2 block text-sm font-medium text-gray-500">Freight Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-4">
                  {freightOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setData({
                          ...data,
                          shipping: {
                            ...data.shipping,
                            freightType: opt.id,
                            shippingMethod: "",
                          },
                        })
                      }
                      className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600"
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${data.shipping.freightType === opt.id
                          ? "border-indigo-600"
                          : "border-gray-300"
                          }`}
                      >
                        {data.shipping.freightType === opt.id && (
                          <span className="h-2 w-2 rounded-full bg-indigo-600" />
                        )}
                      </span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Field
                  label="Carrier"
                  required
                  hint={submitted && carrierRequired ? "Carrier is required." : undefined}
                  hintTone="error"
                >
                  <div className="relative">
                    <select
                      className={`${inputBase1} appearance-none pr-8 ${submitted && carrierRequired ? errorRing + " text-gray-400" : ""
                        }`}
                      value={data.shipping.carrier}
                      onChange={(e) =>
                        setData({
                          ...data,
                          shipping: { ...data.shipping, carrier: e.target.value },
                        })
                      }
                    >
                      <option value="">Select Carrier</option>
                      {carriers.map((c: string) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </Field>

                <Field
                  label="Shipping Method"
                  required
                  hint={submitted && methodRequired ? "Shipping method is required." : undefined}
                  hintTone="error"
                >
                  <div className="relative">
                    <select
                      className={`${inputBase1} appearance-none pr-8 ${submitted && methodRequired ? errorRing + " text-gray-400" : ""
                        }`}
                      value={data.shipping.shippingMethod}
                      onChange={(e) =>
                        setData({
                          ...data,
                          shipping: { ...data.shipping, shippingMethod: e.target.value },
                        })
                      }
                    >
                      <option value="">Select Method</option>
                      {methodOptions.map((m: string) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </Field>
                <Field label="Shipment ID" hint="Auto-generated" hintTone="info">
                  <input
                    disabled
                    className={`${inputBase1} cursor-not-allowed text-gray-400`}
                    value={data.shipping.shipmentId}
                    readOnly
                  />
                </Field>

                <Field
                  label="Shipment Date"
                  required
                  hint={submitted && shipmentDateMissing ? "Shipment date is required." : undefined}
                  hintTone="error"
                >
                  <div className="relative">
                    <input
                      type="date"
                      className={`${inputBase1} pr-2 [color-scheme:light] ${submitted && shipmentDateMissing ? errorRing : ""
                        }`}
                      value={data.shipping.shipmentDate}
                      onChange={(e) =>
                        setData({
                          ...data,
                          shipping: { ...data.shipping, shipmentDate: e.target.value },
                        })
                      }
                    />
                  </div>
                </Field>
              </div>

              <Field label="Notes">
                <textarea
                  rows={2}
                  placeholder="Add special delivery notes (optional)"
                  className={`${inputBase1} resize-none`}
                  value={data.shipping.notes}
                  onChange={(e) =>
                    setData({ ...data, shipping: { ...data.shipping, notes: e.target.value } })
                  }
                />
              </Field>
            </div>

            {/* Additional Services / Tracking */}
            <div className="mt-8 grid grid-cols-12 justify-between border-t border-gray-200 pt-6 ">
              <div className="col-span-12 sm:col-span-7">
                <label className="mb-3 block text-sm font-medium text-gray-900">
                  Additional Services
                </label>
                <div className="grid col-span-1 sm:grid-cols-2 gap-y-3">
                  <Checkbox
                    checked={data.shipping.insuranceCoverage}
                    onChange={(v) =>
                      setData({ ...data, shipping: { ...data.shipping, insuranceCoverage: v } })
                    }
                    label="Insurance Coverage"
                  />
                  <Checkbox
                    checked={data.shipping.temperatureControl}
                    onChange={(v) =>
                      setData({ ...data, shipping: { ...data.shipping, temperatureControl: v } })
                    }
                    label="Temperature Control"
                  />
                  <Checkbox
                    checked={data.shipping.signatureOnDelivery}
                    onChange={(v) =>
                      setData({ ...data, shipping: { ...data.shipping, signatureOnDelivery: v } })
                    }
                    label="Signature on Delivery"
                  />
                  <Checkbox
                    checked={data.shipping.fragileItemHandling}
                    onChange={(v) =>
                      setData({ ...data, shipping: { ...data.shipping, fragileItemHandling: v } })
                    }
                    label="Fragile Item Handling"
                  />
                </div>
              </div>

              <div className="pt-4 sm:pt-0 md:pl-4 col-span-12 sm:col-span-5">
                <label className="mb-3 block text-xs font-medium text-gray-500">
                  Tracking &amp; Status Updates
                </label>
                <div className="flex items-center gap-2">
                  <Toggle
                    checked={data.shipping.notifyRecipient}
                    onChange={(v) =>
                      setData({ ...data, shipping: { ...data.shipping, notifyRecipient: v } })
                    }
                  />
                  <span className="text-xs lg:text-sm text-gray-700">Notify Recipient via Email/SMS</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200"
          >
            <Trash2 size={14} />
            Delete Form
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
          >
            Submit Shipment
          </button>
        </div>
      </div>
    </div>
  );
}