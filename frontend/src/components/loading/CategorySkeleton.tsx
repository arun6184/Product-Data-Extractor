export default function CategorySkeleton() {
    return (
        <div className="card overflow-hidden">
            <div className="skeleton h-48 rounded-t-lg" />
            <div className="p-4 space-y-3">
                <div className="skeleton h-6 w-3/4" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-1/2" />
            </div>
        </div>
    );
}
