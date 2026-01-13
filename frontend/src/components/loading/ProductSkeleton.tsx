export default function ProductSkeleton() {
    return (
        <div className="card overflow-hidden">
            <div className="skeleton h-64 rounded-t-lg" />
            <div className="p-4 space-y-3">
                <div className="skeleton h-5 w-full" />
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-6 w-1/3 mt-4" />
            </div>
        </div>
    );
}
