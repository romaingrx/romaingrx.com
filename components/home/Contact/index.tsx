import Layout from '@/components/core/layout';
import ContactMeForm from './Form';

export function ContactMe() {
  return (
    <div className="">
      <Layout>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="font-wise text-3xl text-romaingrx-brand">
              Want to get in touch?
            </span>
            <span className="text-sm">
              I&apos;m always happy to discuss new projects or simply chat about
              exciting stuff.
            </span>
          </div>
          <ContactMeForm />
        </div>
      </Layout>
    </div>
  );
}
