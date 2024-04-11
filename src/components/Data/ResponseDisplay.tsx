'use client';

interface ResponseDisplayProps {
  response: {
    success: boolean
    message: string
  }
  className?: string
}

const ResponseDisplay = ({ response, className }: ResponseDisplayProps) => (
  <div className={`w-full ${className}`}>
    <h2 className="text-2xl font-bold">Response:</h2>
    <article className="overflow-auto text-wrap">
      {response?.success ? (
        <p className="mt-2 w-full text-ellipsis text-3xl font-bold text-green-500">
          {response?.message}
        </p>
      ) : (
        <p className="mt-2 w-full text-ellipsis text-3xl font-bold text-red-500">
          {response?.message ?? '응답이 없습니다.'}
        </p>
      )}
    </article>
  </div>
);

export default ResponseDisplay;
