Array = {};
function Array.indexOf (array, element)
    for i=1, #array do
        if array[i] == element then
            return i;
        end
    end
    return -1;
end
function Array.push (array, element)
    array[#array + 1] = element;
    print('push', array[#array + 1], #array, #array + 1)
end
function Ternary (cond, t , f)
    if cond then return t else return f end
end