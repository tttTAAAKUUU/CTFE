export default function KycPending() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white text-center">
      <div>
        <h1 className="text-3xl font-semibold mb-4">
          Verification in progress
        </h1>
        <p className="opacity-80">
          We’re reviewing your information. This usually takes a few minutes.
        </p>
      </div>
    </div>
  );
}
