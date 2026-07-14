import { useState } from "react";
import CustomerShell from "../../components/layout/CustomerShell";

const faqs = [
  {
    q: "Where is my order?",
    a: "Open My Orders from the sidebar to see live status. Once a partner accepts your order, you'll see it move from Pending to In Progress to Completed.",
  },
  {
    q: "How do I change my delivery address?",
    a: "Go to Addresses in the sidebar. You can add as many addresses as you like and choose which one to use each time you check out.",
  },
  {
    q: "What payment methods are supported?",
    a: "Cash on delivery, or Whish. You choose which one to use on the checkout page, right before placing your order.",
  },
  {
    q: "Can I cancel an order after placing it?",
    a: "Contact the store directly using the details on your order, or reach out to us below and we'll help sort it out.",
  },
  {
    q: "How do I become a partner and list my store?",
    a: "Log out and choose \"Sign up as a partner\" from the login page. Your store goes live once our team reviews and approves it.",
  },
];

export default function Support() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <CustomerShell>
      <h1 className="fs-3 fw-bold text-navy-900">Help &amp; Support</h1>
      <p className="text-slate-500">Find answers, or reach out to our team directly.</p>

      <div className="row g-4 mt-1">
        <div className="col-lg-7">
          <div className="rounded-xl2 bg-white p-4 shadow-card">
            <h2 className="mb-3 fs-5 fw-bold text-navy-900">Frequently asked questions</h2>
            <div className="d-flex flex-column gap-2">
              {faqs.map((item, idx) => {
                const open = openIndex === idx;
                return (
                  <div key={item.q} className="border rounded-3 overflow-hidden">
                    <button
                      onClick={() => setOpenIndex(open ? null : idx)}
                      className="btn w-100 d-flex align-items-center justify-content-between bg-white border-0 rounded-0 px-3 py-2 text-start fw-semibold text-navy-900"
                    >
                      {item.q}
                      <span className="text-slate-400">{open ? "\u2212" : "+"}</span>
                    </button>
                    {open && (
                      <div className="px-3 pb-3 small text-slate-500">{item.a}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="rounded-xl2 bg-white p-4 shadow-card">
            <h2 className="mb-3 fs-5 fw-bold text-navy-900">Contact us</h2>
            <div className="d-flex flex-column gap-3">
              <ContactRow icon="ti-phone" label="Phone" value="+961 76 123 456" />
              <ContactRow icon="ti-mail" label="Email" value="support@talabaty.com" />
              <ContactRow icon="ti-brand-whatsapp" label="WhatsApp" value="+961 76 123 456" />
              <ContactRow icon="ti-clock" label="Hours" value="Every day, 8 AM \u2013 11 PM" />
            </div>
          </div>

          <div className="rounded-xl2 bg-brand-50 p-4 mt-4">
            <div className="d-flex align-items-center gap-2 mb-1">
              <i className="ti ti-shield-check text-brand-600" aria-hidden="true" />
              <p className="fw-semibold text-navy-900 mb-0">Still stuck?</p>
            </div>
            <p className="small text-slate-600 mb-0">
              Send us a message and our support team will get back to you within a few hours.
            </p>
          </div>
        </div>
      </div>
    </CustomerShell>
  );
}

function ContactRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="d-flex align-items-center gap-3">
      <div className="d-flex align-items-center justify-content-center rounded-3 bg-brand-50 flex-shrink-0" style={{ width: "2.5rem", height: "2.5rem" }}>
        <i className={`ti ${icon} text-brand-600`} aria-hidden="true" />
      </div>
      <div>
        <p className="text-slate-400 mb-0" style={{ fontSize: ".75rem" }}>{label}</p>
        <p className="fw-semibold text-navy-900 mb-0">{value}</p>
      </div>
    </div>
  );
}
