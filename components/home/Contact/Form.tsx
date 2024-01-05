'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input, Textarea } from '@nextui-org/react';
import { Button, Card } from '@/components/core';
import { ArrowIcon } from '@/components/core/Icon/Icon';
import useLocalStorage from '@/hooks/localStorage';
import { motion, AnimatePresence } from 'framer-motion';
import { emailRegex } from '@/components/core/constants';

interface FormData {
  message: string;
  email?: string;
}

export default function ContactMeForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>();

  const [showEmail, setShowEmail] = useState(false);
  const [defaultMessage, setDefaultMessage] = useLocalStorage(
    'contactme-message',
    '',
  );

  const [defaultEmail, setDefaultEmail] = useLocalStorage(
    'contactme-email',
    '',
  );

  const onSubmit = (data: FormData) => {
    console.log(data);
    if (showEmail && data.message && data.email) {
      // sendContactNote(data.email, data.message);
      console.log(data.email, data.message);
      setDefaultMessage('');
      setDefaultEmail('');
    } else if (!showEmail && data.message) {
      setShowEmail(true);
    } else {
      setError('message', {
        type: 'manual',
        message: 'Please enter a message',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, () => console.log('invalid'))}>
      <div className="flex transform flex-col gap-4 transition-all">
        <AnimatePresence mode={'popLayout'}>
          {!showEmail && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-1"
            >
              <Card shadow="md">
                <Textarea
                  {...register('message', {
                    required: 'Please enter a message first',
                  })}
                  label="Message"
                  placeholder="Your message"
                  defaultValue={defaultMessage}
                  color={errors.message ? 'danger' : 'default'}
                  onChange={(e) => {
                    register('message').onChange(e); // Call the default onChange function
                    setDefaultMessage(e.target.value);
                  }}
                />
              </Card>
              {errors.message && (
                <span className="pl-2 text-sm text-danger">
                  {errors.message.message}
                </span>
              )}
            </motion.div>
          )}
          {showEmail && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col gap-1"
            >
              <Card shadow="md">
                <Input
                  {...register('email', {
                    pattern: {
                      value: emailRegex,
                      message: 'Please enter a valid email',
                    },
                    required: 'Please enter an email',
                  })}
                  placeholder="Your email"
                  color={errors.email ? 'danger' : 'default'}
                  defaultValue={defaultEmail}
                  onChange={(e) => {
                    register('email').onChange(e); // Call the default onChange function
                    setDefaultEmail(e.target.value);
                  }}
                />
              </Card>
              {errors.email && (
                <span className="pl-2 text-sm text-danger">
                  {errors.email.message}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex w-full flex-row justify-between">
          {!showEmail ? (
            <div />
          ) : (
            <Button
              variant="secondary"
              startIcon={<ArrowIcon angle={180} />}
              onClick={() => setShowEmail(false)}
            >
              Back
            </Button>
          )}
          {!showEmail ? (
            <Button
              variant="secondary"
              endIcon={<ArrowIcon angle={0} />}
              type="submit"
            >
              Next
            </Button>
          ) : (
            <Button type="submit">Send</Button>
          )}
        </div>
      </div>
    </form>
  );
}
