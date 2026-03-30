export default function KycRejected() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white text-center">
      <div>
        <h1 className="text-3xl font-semibold mb-4">
          Verification failed
        </h1>
        <p className="opacity-80 mb-6">
          Something didn’t match. Please resubmit your details.
        </p>

        <a
          href="/kyc"
          className="underline"
        >
          Try again
        </a>
      </div>
    </div>
  );
}
