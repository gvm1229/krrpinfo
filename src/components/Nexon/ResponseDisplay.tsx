'use client';

interface ResponseDisplayProps {
  response: {
    success: boolean
    message: string
  }
}

const ResponseDisplay = ({ response }: ResponseDisplayProps) => (
  <div>
    <h2 className="text-2xl font-bold">Response:</h2>
    {response?.success ? (
      <p className="mt-2 text-3xl font-bold text-green-500">
        {response?.message}
      </p>
    ) : (
      <p className="mt-2 text-3xl font-bold text-red-500">
        {response?.message ?? '응답이 없습니다.'}
      </p>
    )}
  </div>
);

export default ResponseDisplay;
