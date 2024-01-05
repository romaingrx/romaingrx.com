import Layout from '@/components/core/layout';
import ContactMeForm from './Form';
import { Card, Link } from '@/components/core';

export function ContactMe() {
  return (
    <div className="py-8">
      <Layout>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-0">
            <span className="font-wise text-3xl text-romaingrx-brand">
              Want to get in touch?
            </span>
            <span className="text-sm">
              I'm always happy to discuss new projects or simply chat about
              exciting stuff.
            </span>
          </div>
          <ContactMeForm />
        </div>
      </Layout>
    </div>
  );
}
