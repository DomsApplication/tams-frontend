import { createSearchParams, useLocation, useNavigate } from "react-router-dom";

const UtilUseQuery = (function () {
    return {
        useQuery() {
            const { search } = useLocation();
            return new URLSearchParams(search)
        },
        useQueryParam({queryKey}: {queryKey: string}){
            const query = UtilUseQuery.useQuery();
            return query.get(queryKey);
        },
        useSetQueryParam() {
            const navigate = useNavigate();
        
            return (params: Record<string, string>) => {
                const options = {
                    pathname: window.location.pathname,
                    search: `?${createSearchParams(params)}`
                }
                navigate(options, {replace: true})
            }
        },
    };
  })();
  
  export default UtilUseQuery;
  