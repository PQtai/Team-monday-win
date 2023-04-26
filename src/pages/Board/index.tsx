import React from 'react';
import './board.scss';
import { faCircleExclamation, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TabCustom from '~/components/TabCustom';
import Tippy from '~/components/Tippy';
import MainTable from '~/components/MainTable';
import Cards from '~/components/Cards';
const Board = () => {
   return (
      <div className="board__wrapper">
         <p className="board__title">
            <span>Monday</span> <FontAwesomeIcon icon={faCircleExclamation} />
         </p>

         <TabCustom
            arr={[
               {
                  label: (
                     <Tippy position="top" html={<p>Main table</p>}>
                        <span>
                           <FontAwesomeIcon className="icon__table" icon={faHouse} />
                           Main table
                        </span>
                     </Tippy>
                  ),
                  info: <MainTable />,
               },
               {
                  label: (
                     <Tippy position="top" html={<p>Cards</p>}>
                        <span>
                           <FontAwesomeIcon className="icon__table" icon={faCircleExclamation} />
                           Cards
                        </span>
                     </Tippy>
                  ),
                  info: <Cards />,
               },
            ]}
         />
      </div>
   );
};

export default Board;
