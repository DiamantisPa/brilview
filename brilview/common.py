import numpy as np
import numbers
import calendar, datetime

#class ini_parser(ConfigParser.SafeConfigParser):
#    '''
#    extended SafeConfigParser class adding as_dict method
#    '''
#    def as_dict(self):
#        d = dict(self._sections)
#        for k in d:
#            d[k] = dict(self._defaults, **d[k])
#            d[k].pop('__name__', None)
#        return d

def blob_to_array(iblob,itypecode):
    '''
    unpack blob(buffer) to c array
    '''
    if not isinstance(iblob,buffer) and not isinstance(iblob,str):
        return None
    if itemtypecode not in ['c','b','B','u','h','H','i','I','l','L','f','d']:
        raise RuntimeError('unsupported typecode '+itemtypecode)
    result=array.array(itemtypecode)

    if not iblob :
        return None
    result.fromstring(iblob)
    return result

def _find_datebins(tsarray, bintype='day'):
    '''
    Digitize input array by date type (day, week, month,year).
    input: list of unixtimestamp
    output:
    [[pos_in_tsarray),],[],[]]
   
    '''
    list_of_dts = [ ( i,datetime.datetime.utcfromtimestamp(x) )  for (i,x) in enumerate(tsarray) ]
    data = {}
    for (i,dt) in list_of_dts :
        if bintype=='day':
            data.setdefault( dt.toordinal(), [] ).append( i )
        elif bintype=='week':
            data.setdefault( dt.isocalendar()[0]*100+dt.isocalendar()[1],[] ).append( i )
        elif bintype=='month':
            data.setdefault( dt.year*100+dt.month,[] ).append( i )
        elif bintype=='year':
            data.setdefault( dt.year,[] ).append( i )
    results = [ data.get(x, []) for x in range(min(data), max(data)+1) ]
    return results

def _find_numbins(numarray,nbins=None,step_size=None):
    '''
    Digitize input number list by number of bins or step size
    output:
    [[pos_in_numarray,],[],[]]
      or None is input array is not digitized
    '''
    step_count = 0
    bins = 100 
    if nbins:
        bins = nbins
    elif step_size:
        bins = np.arange( min(numarray),max(numarray)+step_size, step_size )
    if isinstance(bins, numbers.Number) :
        if bins > len(numarray):
            return None # not aggregated    
    else:
        if bins.size > len(numarray): # no need of aggregation
            return None
            
    ( hist, bin_edges ) = np.histogram( np.array(numarray), bins=bins )
    results = []
    for i,e in enumerate( bin_edges[:-1] ):
        left_edge = e
        right_edge = bin_edges[i+1]
        pos = []
        if i==(bin_edges.size-2):#if last bin, the right edge is inclusive 
            pos = np.where( (numarray<=right_edge)&(numarray>=left_edge) )[0]
        else:
            pos = np.where( (numarray<right_edge)&(numarray>=left_edge) )[0]
        results.append( list(pos) )
    return results

def aggregate_1d(inputdata, bindef, aggalgos):
    '''
    inputs:
      inputdata: {
        'time':...
        'val1': ...
     }
     bindef: {
        field: str,
        step_size: int | None,
        step_unit: str (number,week,month,day) | None,
        step_count: int |None,        
     }
     aggalgos: {
           "<fieldname>": str, # left, right, middle, min, max, avg, sum
           ...
     }

    outputs:
    {
         'aggregated': True/False
         'data':{
             field: array
        }
    }
    '''
    if not bindef.has_key('field'):
        raise KeyError('field not found in the bindef input, cannot decide on the binning variable')
    binning_field = bindef['field']    
    binning_array = inputdata[binning_field]
    step_unit = 'number'
    pos = None
    result = {}
    if bindef.has_key('step_unit') and bindef['step_unit']:
        step_unit = bindef['step_unit']
    if step_unit =='number':
        pos = _find_numbins(binning_array,nbins=bindef.get('step_count',None),step_size=bindef.get('step_size',None))
    elif step_unit in ['day','week','month','year']:
        pos = _find_datebins(binning_array,bintype=step_unit)
    if not pos:
        result['aggregated'] = False
        return result
    result['aggregated'] = True
    result['data'] = {}
    for posbucket in pos:
        if not posbucket:
            result['data'].setdefault(binning_field,[]).append(None)
            continue
        leftedge = posbucket[0]
        result['data'].setdefault(binning_field,[]).append( binning_array[leftedge] ) #left
        
    for posbucket in pos:
        for fieldname in aggalgos.keys():
            if not posbucket: #empty bin
                result['data'].setdefault(fieldname,[]).append(None)  
                continue
            aggalgo = aggalgos[fieldname]
            toaggregate = [ inputdata[fieldname][i] for i in posbucket ]
            if aggalgo=='average':                
                result['data'].setdefault(fieldname,[]).append( np.average(toaggregate) )
            elif aggalgo=='sum':
                result['data'].setdefault(fieldname,[]).append( np.sum(toaggregate) )
            elif aggalgo=='max':
                result['data'].setdefault(fieldname,[]).append( np.max(toaggregate) )
            elif aggalgo=='min':
                result['data'].setdefault(fieldname,[]).append( np.min(toaggregate) )
            elif aggalgo=='left':
                result['data'].setdefault(fieldname,[]).append( toaggregate[0] )
            elif aggalgo=='right':
                result['data'].setdefault(fieldname,[]).append( toaggregate[-1] )
            elif aggalgo=='middle':
                if len(toaggregate)==1:
                    result['data'].setdefault(fieldname,[]).append( toaggregate[0] )
                elif len(toaggregate)%2==0:
                    result['data'].setdefault(fieldname,[]).append( toaggregate[ len(toaggregate)/2-1 ] )
                else:
                    result['data'].setdefault(fieldname,[]).append( toaggregate[ len(toaggregate)/2 ] )
    return result

if __name__=='__main__':        

    tt = [1452242977,1483865377,1484038177,1484045377,1484131777,1484149777,1484749869,1468852268,1474209068,1473949868]
    result =_find_datebins(tt, bintype='month')
    print 'date result ',result

    nn =  [0.2, 0.3, 0.4, 1.1, 1.2, 3.3, 3.0, 4.1, 6.2, 16.1]
    result = _find_numbins(nn,nbins=None,step_size=3)
    print 'num result by step size ',result
    result = _find_numbins(nn,nbins=5,step_size=None)
    print 'num result by nbins ',result

    inputdata = {
        'time': tt,
        'velocity': nn        
    }
    bindef = {
        'field': 'time',
        'step_unit': 'month'        
    }
    
    aggalgos = {
        'velocity': 'max'
    }
    result = aggregate_1d(inputdata, bindef, aggalgos)
    print result

    bindef = {
        'field': 'velocity',
        'step_unit': 'number',
        'step_count': 5
    }
    aggalgos = {
        'time': 'max'
    }
    result = aggregate_1d(inputdata, bindef, aggalgos)
    print result
