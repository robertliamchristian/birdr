with main as (
select l.birdid, l.bird, t.family_com_name, t.taxon_order
from log l
left join tax t on l.bird = t.common_name
)

select * 
,row_number() over (order by main.taxon_order) as row_num
from main
order by main.taxon_order