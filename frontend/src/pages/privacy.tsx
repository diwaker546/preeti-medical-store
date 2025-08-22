export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p>We collect phone number, name, address and prescription photos to process orders. Data is stored in AWS DynamoDB and images in S3. We do not share your personal data without consent except as required by law.</p>
    </div>
  );
}
