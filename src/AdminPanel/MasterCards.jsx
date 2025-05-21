
import React from 'react';
import '../Style/MasterCards.css';


const MasterCards = ({ setSelectedTab }) =>
{

    const handleCardClick = (tabKey) =>
    {
        setSelectedTab(tabKey);
    };

    return (
        <div className="master-cards">
            <div className="card" onClick={() => handleCardClick('bestjob')}>
                Best Job
            </div>
           
            <div className="card" onClick={() => handleCardClick('feature-job')}>
               Feature Job
            </div>
           
            <div className="card" onClick={() => handleCardClick('recent-job')}>
                Recent Job
            </div>

            
            
            
        </div>
    );
};

export default MasterCards;
