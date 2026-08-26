import type { Metadata } from "next";
import { getBikes } from "../../../lib/catalogue";
import { StoreFooter } from "../store-footer";
import { StoreHeader } from "../store-header";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Craig's Bikes",
  description:
    "Returns are accepted within 14 days of delivery on eligible purchases. Read how returns, damaged items, return shipping and refunds are handled at Craig's Bikes.",
  alternates: { canonical: "/return-policy" },
};

export const revalidate = 3600;

export default async function ReturnPolicyPage() {
  const bikes = await getBikes();

  return (
    <div className="page-shell legal-page">
      <StoreHeader />
      <main>
        <section className="legal-hero">
          <span className="eyebrow"><i /> Buying with confidence</span>
          <h1>Return &amp; Refund Policy</h1>
          <p>
            At Craig&rsquo;s Bikes, we specialize in vintage and collectible old-school BMX bicycles.
            Each bike is carefully photographed, inspected, and described before being listed for sale.
          </p>
        </section>

        <article className="legal-body">
          <section>
            <h2>Returns</h2>
            <p>We accept returns within 14 days of delivery for eligible purchases.</p>
            <p>
              To qualify for a return, the bicycle must be returned in the same condition in which it
              was received. It must not have been ridden, modified, repainted, disassembled, or
              otherwise altered after delivery.
            </p>
            <p>
              All original parts, accessories, and documentation included with the purchase must be
              returned with the bicycle.
            </p>
            <p className="legal-callout">
              Customers must contact Craig&rsquo;s Bikes before sending a return. Do not ship a bike
              back without receiving return instructions from us.
            </p>
          </section>

          <section>
            <h2>Damaged or defective items</h2>
            <p>
              If your bicycle arrives damaged, defective, or materially different from the description
              provided on the product listing, please contact us within 48 hours of delivery and
              provide photographs showing the issue.
            </p>
            <p>
              We will review the claim and, when appropriate, provide return instructions and an
              appropriate resolution.
            </p>
          </section>

          <section>
            <h2>Return shipping</h2>
            <p>
              For approved returns that are not the result of damage, a defect, or an error in the
              product description, the customer is responsible for return shipping costs.
            </p>
            <p>Original shipping charges are generally non-refundable.</p>
          </section>

          <section>
            <h2>Refunds</h2>
            <p>
              Once a returned bicycle has been received and inspected, we will confirm whether the
              return has been approved.
            </p>
            <p>
              Approved refunds will be issued to the original payment method. Processing times may
              vary depending on the payment provider.
            </p>
          </section>

          <section>
            <h2>Vintage and collectible bicycles</h2>
            <p>
              Our bicycles are vintage and collectible items. Normal signs of age, wear, patina, minor
              imperfections, replacement parts, and restoration may be present depending on the
              individual bicycle. These details will be disclosed in the product listing whenever
              applicable.
            </p>
            <p>
              Customers are encouraged to carefully review the photographs, description,
              specifications, and condition information before purchasing.
            </p>
          </section>

          <section>
            <h2>Exchanges</h2>
            <p>
              We do not offer direct exchanges. If a return is approved, the original purchase will be
              handled according to this policy and a new purchase may be made separately.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              If you have questions about a return or need to request a return, please contact
              Craig&rsquo;s Bikes through our website support channel.
            </p>
            <a className="button button-blue" href="https://wa.me/16089573848" target="_blank" rel="noreferrer">
              Contact support <span>→</span>
            </a>
          </section>
        </article>
      </main>
      <StoreFooter bikes={bikes} />
    </div>
  );
}
