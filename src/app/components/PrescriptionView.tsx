"use client";

export interface PrescriptionItemData {
  id: string;
  name: string;
  genericName: string | null;
  strengthForm: string | null;
  category: string | null;
  dosage: string;
  collectFromElsewhere: boolean;
}

export interface PrescriptionData {
  id: string;
  advice: string | null;
  revision: number;
  updatedAt: string;
  items: PrescriptionItemData[];
}

interface Props {
  prescription: PrescriptionData | null;
  doctorName?: string;
  emptyMessage?: string;
}

export default function PrescriptionView({
  prescription,
  doctorName,
  emptyMessage = "No prescription has been written for this consultation yet.",
}: Props) {
  if (!prescription) {
    return (
      <div className="border rounded-xl p-5 bg-gray-50 text-sm text-gray-800 min-h-[120px]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between gap-3">
        <div>
          {doctorName && <p className="text-sm font-medium">{doctorName}</p>}
          <p className="text-xs text-gray-500">
            {new Date(prescription.updatedAt).toLocaleString()}
          </p>
        </div>
        {prescription.revision > 1 && (
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800 flex-shrink-0">
            Updated · revision {prescription.revision}
          </span>
        )}
      </div>

      <ul className="divide-y">
        {prescription.items.map((item) => (
          <li key={item.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium break-words">{item.name}</p>
                {(item.genericName || item.strengthForm) && (
                  <p className="text-sm text-gray-500 break-words">
                    {item.genericName}
                    {item.strengthForm ? ` · ${item.strengthForm}` : ""}
                  </p>
                )}
              </div>
              {item.collectFromElsewhere && (
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-100 text-amber-800 flex-shrink-0">
                  Collect from elsewhere
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
              {item.dosage}
            </p>
          </li>
        ))}
      </ul>

      {prescription.advice && (
        <div className="px-5 py-4 border-t bg-gray-50">
          <p className="text-xs text-gray-500 mb-1">Advice</p>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">
            {prescription.advice}
          </p>
        </div>
      )}
    </div>
  );
}
