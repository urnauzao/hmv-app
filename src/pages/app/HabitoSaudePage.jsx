import React from 'react';

const HabitoSaudePage = () => {
    console.log('habitos');
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Hábitos de Saúde</h5>
                    <p>Use this page to start from scratch and place your custom content.</p>
                </div>
            </div>
        </div>
    );
}

// const comparisonFn = function (prevProps, nextProps) {
//     return prevProps.location.pathname === nextProps.location.pathname;
// };

// export default React.memo(HabitoSaudePage, comparisonFn);
export default HabitoSaudePage;
