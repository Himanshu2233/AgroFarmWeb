import { FormProvider as RHFFormProvider } from 'react-hook-form';

export default function FormProvider({ methods, onSubmit, children, className = '' }) {
  return (
    <RHFFormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </RHFFormProvider>
  );
}
