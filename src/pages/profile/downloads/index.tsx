import Link from 'next/link';
import { withProfileLayout } from '../_layout';

function DownloadsPage() {
    // This is a placeholder. In a real application, you would fetch downloads from an API
    const hasDownloads = false; // Set to true if the user has downloads

    return (
        <div className="tab-pane fade show active" id="tab-downloads" role="tabpanel" aria-labelledby="tab-downloads-link">
            {hasDownloads ? (
                <div>
                    {/* Downloads would be displayed here */}
                    <p>Downloads will be displayed here.</p>
                </div>
            ) : (
                <>
                    <p>Henüz indirilebilir içerik bulunmamaktadır.</p>
                    <Link href="/products" className="btn btn-outline-primary-2">
                        <span>ALIŞVERİŞE BAŞLA</span>
                        <i className="icon-long-arrow-right"></i>
                    </Link>
                </>
            )}
        </div>
    );
}

export default withProfileLayout(DownloadsPage); 