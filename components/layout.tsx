export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col max-w-4xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0">
            {children}
        </div>
    );
}